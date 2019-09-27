import Installer from './Installer';
import InstallerController from './InstallerController';

const controller = new InstallerController();

const installer = new Installer(controller);
installer.run();