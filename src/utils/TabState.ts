class TabState {
  private static instance: TabState;
  private isTabOpen: boolean = false; 

  private constructor() {}

  public static getInstance(): TabState {
    if (!TabState.instance) {
      TabState.instance = new TabState();
    }
    return TabState.instance;
  }

  public initialize(): void {
    // No-op in local mode (retained for interface compatibility)
  }

  public markOpen(): void {
    this.isTabOpen = true;
  }

  public markClosed(): void {
    this.isTabOpen = false;
  }

  public isOpen(): boolean {
    return this.isTabOpen;
  }

}

export const tabState = TabState.getInstance();
