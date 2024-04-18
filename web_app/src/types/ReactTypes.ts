import React from "react";

export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];