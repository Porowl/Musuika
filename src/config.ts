import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'matter',
    matter: {
        enableSleeping: true,
        gravity: {
            y: 1
        },
        debug: {
            showBody: false,
            showStaticBody: false
        }
    }
  }
};
