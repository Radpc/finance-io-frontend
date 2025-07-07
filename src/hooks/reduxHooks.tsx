import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../storage";
type DispatchFunc = () => AppDispatch;
export const useReduxDispatch: DispatchFunc = useDispatch;
export const useRedux: TypedUseSelectorHook<RootState> = useSelector;
