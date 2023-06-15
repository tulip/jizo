export type AxeReport = {
  url: string;
  toolOptions: {
    runOnly: {
      values: string[];
    }
  }
  violations: [{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: [{
      failureSummary: string;
      html: string;
      target: string[];
    }]
  }]
};
