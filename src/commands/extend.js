const {Command, flags} = require('@oclif/command');
const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const destinationRoot = path.resolve(projectRoot, 'src', 'app');
const sampleComponentPath = path.resolve(projectRoot, 'cli', 'data', 'extend', 'Sample');
const magentoRoot = path.resolve(projectRoot, '..', '..', '..', '..', '..');
const fallbackRoot = path.resolve(magentoRoot, 'vendor', 'scandipwa', 'source', 'src', 'app');

class CreateCommand extends Command {
    async run() {
        this.target = this.parse(CreateCommand).args.target;
        this.forceOverride = this.parse(CreateCommand).flags.force || false;
        this.createComponent = this.parse(CreateCommand).flags.component || false;
        this.createContainer = this.parse(CreateCommand).flags.container || false;
        this.createStyle = this.parse(CreateCommand).flags.style || false;

        this.validateInput();
        this.checkSource();
        this.checkDestination();
        this.copyToTheme();
    }

    validateInput() {
        if (!this.target) {
            this.error('Please specify target to create. e.g. "pwa create component/Menu"', { exit: true });
        }

        const supportedComponentTypes = ['component', 'route'];
        this.targetType = this.target.split('/')[0].toLowerCase();
        if (!supportedComponentTypes.includes(this.targetType)) {
            this.error(`${this.targetType} is not supported.`, { exit: false });
            this.error(`Please chose target that starts with ${supportedComponentTypes.join(' or ')}`, { exit: true });
        }

        if (this.target.indexOf('/') === -1) {
            this.error('Please specify target name. e.g. "pwa create component/Menu"', { exit: true });
        }
        let unformattedName = this.target.split('/')[1];
        this.targetName = unformattedName.charAt(0).toUpperCase() + unformattedName.slice(1);

        if (!this.createContainer && !this.createComponent && !this.createStyle) {
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
            this.error(`Theme already has ${this.targetType}/${this.targetName}. Use -f to force.`, { exit: true });
        }
    }

    copyToTheme() {
        const itemsToCopy = [
            {shouldCreate: this.createComponent && !this.createStyle, name: 'Sample.component.js'},
            {shouldCreate: this.createComponent && this.createStyle, name:'Sample.component.withExtendedStyle.js'},
            {shouldCreate: this.createStyle, name:'Sample.extended.style.scss'}
        ];

        itemsToCopy.forEach(item => {
            if (item.shouldCreate) {
                let destinationFile = path.resolve(
                    this.destinationPath,
                    item.name.replace('Sample', this.targetName).replace('.withExtendedStyle', '')
                );
                fs.copySync(path.resolve(sampleComponentPath, item.name), destinationFile);

                // Correct name in files of the new Component
                replace.sync({
                    files: destinationFile,
                    from: /Sample/g,
                    to: this.targetName,
                });
            }
        });
    }
}

CreateCommand.description = `Create a sample component or route
If none of -c or -s flags are passed both the component and style will be extended.
`;

CreateCommand.flags = {
    force: flags.boolean({char: 'f', description: 'Override files in theme folder if they exist'}),
    component: flags.boolean({char: 'c', description: 'Create component file'}),
    style: flags.boolean({char: 's', description: 'Create style file'}),
};

CreateCommand.args = [
    {name: 'target'},
];

module.exports = CreateCommand;
