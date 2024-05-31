declare interface Window extends Window {
    __LMO_APP_CONFIG: Readonly<{
        readonly __PLAYER_EL_ID: `__lmo_dv_app_player_${string}`;
        readonly __PREVIEWER_EL_ID: `__lmo_dv_app_preview_${string}`;
    }>
}
