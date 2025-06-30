import {
  fetchLastSnapshot,
  subscribeLiveSensors,
} from '../models/sensorModel';

export class HivePresenter {
  private view: HiveView;          // interface que la View implémente
  private channel: any | null = null;

  constructor(view: HiveView) {
    this.view = view;
  }

  async loadInitial(hiveId: string) {
    try {
      const snap = await fetchLastSnapshot(hiveId);
      this.view.displaySnapshot(snap);
      this.subscribeLive(hiveId);
    } catch (e: any) {
      this.view.showError(e.message);
    }
  }

  private subscribeLive(hiveId: string) {
    this.channel = subscribeLiveSensors(hiveId, row =>
      this.view.displaySnapshot(row)
    );
  }

  dispose() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

/* Exemple d’interface minimale pour la View */
export interface HiveView {
  displaySnapshot(snap: { temperature: number; humidity: number; weight: number }): void;
  showError(msg: string): void;
}
