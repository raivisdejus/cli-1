const {Command, flags} = require('@oclif/command');
const path = require('path');
const fs = require('fs-extra');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const destinationRoot = path.resolve(projectRoot, 'src', 'app');
const magentoRoot = path.resolve(projectRoot, '..', '..', '..', '..', '..');
const fallbackRoot = path.resolve(magentoRoot, 'vendor', 'scandipwa', 'source', 'src', 'app');

class OverrideCommand extends Command {
    async run() {
        this.target = this.parse(OverrideCommand).args.target;
        this.forceOverride = this.parse(OverrideCommand).flags.force || false;
        this.createIndex = this.parse(OverrideCommand).flags.index || false;
        this.createComponent = this.parse(OverrideCommand).flags.component || false;
        this.createContainer = this.parse(OverrideCommand).flags.container || false;
        this.createStyle = this.parse(OverrideCommand).flags.style || false;

        this.validateInput();
        this.checkSource();
        this.checkDestination();
        this.copyToTheme();
    }

    validateInput() {
        if (!this.target) {
            this.error('Please specify target to override. e.g. "pwa extend component/Menu"', { exit: true });
        }

        this.targetType = this.target.split('/')[0].toLowerCase();

        if (this.target.indexOf('/') === -1) {
            this.error('Please specify target name. e.g. "pwa create component/Menu"', { exit: true });
        }
        let unformattedName = this.target.split('/')[1];
        this.targetName = unformattedName.charAt(0).toUpperCase() + unformattedName.slice(1);

        if (!this.createIndex && !this.createContainer && !this.createComponent && !this.createStyle) {
            this.createIndex = true;
            this.createContainer = true;
            this.createComponent = true;
            this.createStyle = true;
        }
    }

    checkSource() {
        this.sourcePath = path.resolve(
            fallbackRoot,
            this.targetType,
            this.targetName
        );

        if (!fs.existsSync(this.sourcePath)){
            this.error(`Override target not found in source, check that folder ${this.targetType}/${this.targetName} exist in ${fallbackRoot}`, { exit: true });
        }
    }

    checkDestination() {
        this.destinationPath = path.resolve(
            destinationRoot,
            this.targetType,
            this.targetName
        );

        if (fs.existsSync(this.destinationPath) && !this.forceOverride){
            this.error(`Theme already has ${this.target}. Use -f to force.`, { exit: true });
        }
    }

    copyToTheme() {
        const itemsToCopy = [
            {shouldCreate: this.createIndex, name: 'index.js'},
            {shouldCreate: this.createContainer, name: `${this.targetName}.container.js`},
            {shouldCreate: this.createComponent, name: `${this.targetName}.component.js`},
            {shouldCreate: this.createStyle, name:`${this.targetName}.style.scss`}
        ];

        itemsToCopy.forEach(item => {
            if (item.shouldCreate) {
                fs.copySync(
                    path.resolve(
                        this.sourcePath,
                        item.name
                    ),
                    path.resolve(
                        this.destinationPath,
                        item.name
                    )
                );
            }
        });
    }
}

OverrideCommand.description = `Copy source files to theme to override
If none of -i, -c, -n or -s flags are passed all usual component files will be overridden.
`;

OverrideCommand.flags = {
    force: flags.boolean({char: 'f', description: 'Override files in theme folder if they exist'}),
    index: flags.boolean({char: 'i', description: 'Override the index file'}),
    component: flags.boolean({char: 'c', description: 'Override component file'}),
    container: flags.boolean({char: 'n', description: 'Override container file'}),
    style: flags.boolean({char: 's', description: 'Override style file'}),
};

OverrideCommand.args = [
    {name: 'target'},
];

module.exports = OverrideCommand;
