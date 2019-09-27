import {
  MessageTypes,
  ActionClickedMessage
} from '~/types';

export default (): ActionClickedMessage => ({
  type: MessageTypes.ACTION_CLICKED
});