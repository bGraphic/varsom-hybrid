export class Theme {

  static colorForStatusBar() {
    return '#788788';
  }

  static colorForLevel(level: number) {
    switch (level) {
      case 0:
        return '#C8C8C8';
      case 1:
        return '#75B100';
      case 2:
        return '#FFCC33';
      case 3:
        return '#E46900';
      case 4:
        return '#D21523';
      case 5:
        return '#3E060B';
      default:
        return '#C8C8C8'


    }

  }
}
