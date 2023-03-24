export type BaseDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
};

/**
 * @template ActionParams What we're going to pass to onAction
 * @template Result What we expect onAction to return
 * @template SuccessParams What we're going to pass to onSuccess
 */
export interface BaseDialogActionProps<ActionParams extends any[], Result, SuccessParams extends any[]>
  extends BaseDialogProps {
  onAction: (...params: ActionParams) => Result;
  onCancel?: () => void;
  onSuccess?: (...params: SuccessParams) => void;
  isLoading?: boolean;
  reset?: () => void;
}
