::	=========================================
::	|										|
::	|      	lmo-Data-Visualization          |
::	|										|
::	|			Author ayuanlmo				|
::	|										|
::	|		Created by ayuanlmo on 2022		|
::	|										|
::	=========================================

@echo OFF
title lmo-Data-Visualization Server-Start

echo.
    echo.
    echo ________________________________________________
    echo.
    echo.
    echo                 lmo-Data-Visualization
    echo.
    echo ________________________________________________
    echo.
    echo.

if exist node_modules (
    echo Node v
    node -v
    yarn start-server
    pause
) else (
    call install
    call start
)
