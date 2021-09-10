
class Series {

    constructor({num, name, seasons_out, seasons_seen, seasons_in_progress, seasons_not_seen, seasons_coming, isFinished, note, wikiFR, wikiEN}) {
        this.num = num;
        this.name = name;
        this.seasons_out = seasons_out;
        this.seasons_seen = seasons_seen;
        this.seasons_in_progress = seasons_in_progress;
        this.seasons_not_seen = seasons_not_seen;
        this.seasons_coming = seasons_coming;
        this.isFinished = isFinished;
        this.note = note;
        this.wikiFR = wikiFR;
        this.wikiEN = wikiEN;
    }

}

export class SeriesManager {

    constructor(categories= {}) {
        this.categories = categories;
    }

    add(name, series = []) {
        this.categories[name] = series;
    }

    remove(name) {
        delete this.categories[name];
    }

}
