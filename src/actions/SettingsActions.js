import {
  SETTINGS_UPDATE,
  FETCH_CALENDAR_SETTINGS,
  FETCH_NOTIFICATION_SETTINGS,
  SETTINGS_CONFIG_SUCCESS,
  SETTINGS_CONFIG_FAIL,
  SERVER_ADDRESS
} from "./types";
import { SettingsAPI } from "../services";

//Retrieve calendar settings
export const fetchCalendarSettings = () => async dispatch => {
  try {
    const request = await SettingsAPI.getSettings();
    const settings = request.data;
    dispatch({
      type: FETCH_CALENDAR_SETTINGS,
      payload: { ...settings.data.attributes }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SETTINGS_CONFIG_FAIL,
      payload: { message: e.toString() },
      error: true
    });
  }
};

//Update calendar settings
export const updateCalendarSettings = (data, type) => async dispatch => {
  try {
    const request = await SettingsAPI.updateSettings(data);
    const settings = request.data;
    dispatch({
      type: SETTINGS_CONFIG_SUCCESS,
      payload: { ...settings.data.attributes, type }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SETTINGS_CONFIG_FAIL,
      payload: { message: e.toString() },
      error: true
    });
  }
};

//Retrieve notification settings
export const fetchNotificationSettings = () => async dispatch => {
  try {
    const request = await SettingsAPI.getSettings();
    const settings = await request.data;
    dispatch({
      type: FETCH_NOTIFICATION_SETTINGS,
      payload: { ...settings.data.attributes }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SETTINGS_CONFIG_FAIL,
      payload: { message: e.toString() },
      error: true
    });
  }
};

//Update NotificationSettings
export const updateNotificationSettings = (data, type) => async dispatch => {
  try {
    const request = await SettingsAPI.updateSettings(data);
    const settings = await request.data;
    dispatch({
      type: SETTINGS_CONFIG_SUCCESS,
      payload: { ...settings.data.attributes, type }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SETTINGS_CONFIG_FAIL,
      payload: { message: e.toString() },
      error: true
    });
  }
};
