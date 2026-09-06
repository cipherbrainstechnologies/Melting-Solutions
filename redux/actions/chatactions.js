import store from '../store/store';
import moment from 'moment';
import { CLEAR_CHATBOARD_DATA, CLEAR_CHAT_ERROR } from '../store/type';

export const clearChatBoardData = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_CHATBOARD_DATA,
    payload: null
  });
};


