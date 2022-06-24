//这是pinia官方文档中仅有的定义接口方法 https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
//如此定义之后导入接口只需 import {接口名} from 'interface'
//官方似乎推荐将接口嵌入pinia模块，为避免混淆不予使用 china12315
declare module 'storeInterface' {
    export interface ThemeConfigState {
        themeConfig: {
            isDrawer: boolean;
            primary: string;
            success: string;
            info: string;
            warning: string;
            danger: string;
            topBar: string;
            menuBar: string;
            columnsMenuBar: string;
            topBarColor: string;
            menuBarColor: string;
            columnsMenuBarColor: string;
            isTopBarColorGradual: boolean;
            isMenuBarColorGradual: boolean;
            isColumnsMenuBarColorGradual: boolean;
            isMenuBarColorHighlight: boolean;
            isCollapse: boolean;
            isUniqueOpened: boolean;
            isFixedHeader: boolean;
            isFixedHeaderChange: boolean;
            isClassicSplitMenu: boolean;
            isLockScreen: boolean;
            lockScreenTime: number;
            isShowLogo: boolean;
            isShowLogoChange: boolean;
            isBreadcrumb: boolean;
            isTagsview: boolean;
            isBreadcrumbIcon: boolean;
            isTagsviewIcon: boolean;
            isCacheTagsView: boolean;
            isSortableTagsView: boolean;
            isShareTagsView: boolean;
            isFooter: boolean;
            isGrayscale: boolean;
            isInvert: boolean;
            isIsDark: boolean;
            isWartermark: boolean;
            wartermarkText: string;
            tagsStyle: string;
            animation: string;
            columnsAsideStyle: string;
            columnsAsideLayout: string;
            layout: string;
            isRequestRoutes: boolean;
            globalTitle: string;
            globalViceTitle: string;
            globalI18n: string;
            globalComponentSize: string;
        };
    }

    // 路由列表
    export interface RoutesListState {
        routesList: Array<object>;
        isColumnsMenuHover: Boolean;
        isColumnsNavHover: Boolean;
    }

    // 路由缓存列表
    export interface KeepAliveNamesState {
        keepAliveNames: string[];
        cachedViews: string[];
    }

    // TagsView 路由列表
    export interface TagsViewRoutesState {
        tagsViewRoutes: Array<string>;
        isTagsViewCurrenFull: Boolean;
    }

    // 用户信息
    export interface UserInfosState {
        userInfos: any;
    }

    // 后端返回原始路由(未处理时)
    export interface RequestOldRoutesState {
        requestOldRoutes: Array<string>;
    }
}