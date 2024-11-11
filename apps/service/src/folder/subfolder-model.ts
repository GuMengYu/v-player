
export class SubfolderModel {
    public constructor(
        public path: string,
        public isGoToParent: boolean,
    ) {}

    public isSelected: boolean = false;
    public isPlaying: boolean = false;
}
