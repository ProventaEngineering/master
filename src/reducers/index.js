import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import UserReducer from "./UserReducer";
import MeetingReducer from "./MeetingReducer";
import SettingsReducer from "./SettingsReducer";
import HistoryReducer from "./HistoryReducer";

export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  meeting: MeetingReducer,
  settings: SettingsReducer,
  history: HistoryReducer
});
