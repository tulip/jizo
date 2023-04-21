export type AlertDismissedEventDetail = {
  type: string;
  dismissed: boolean;
  action: string | null;
};

export type AlertActionEventDetail = {
  type: string;
  dismissed: boolean;
  action: string | null;
};
