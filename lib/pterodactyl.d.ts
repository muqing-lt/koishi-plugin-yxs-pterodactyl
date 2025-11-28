import { Context, Schema } from 'koishi';
export declare const Config: Schema<Schemastery.ObjectS<{
    panelUrl: Schema<string, string>;
    allowedGroups: Schema<string[], string[]>;
    commands: Schema<Schemastery.ObjectS<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>, Schemastery.ObjectT<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>>;
}>, Schemastery.ObjectT<{
    panelUrl: Schema<string, string>;
    allowedGroups: Schema<string[], string[]>;
    commands: Schema<Schemastery.ObjectS<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>, Schemastery.ObjectT<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>>;
}>>;
export interface ConfigType {
    panelUrl: string;
    allowedGroups: string[];
    commands: {
        bind: string;
        unbind: string;
        start: string;
        stop: string;
        restart: string;
        kill: string;
        status: string;
    };
}
export declare function apply(ctx: Context, config: ConfigType): void;
export declare const config: Schema<Schemastery.ObjectS<{
    panelUrl: Schema<string, string>;
    allowedGroups: Schema<string[], string[]>;
    commands: Schema<Schemastery.ObjectS<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>, Schemastery.ObjectT<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>>;
}>, Schemastery.ObjectT<{
    panelUrl: Schema<string, string>;
    allowedGroups: Schema<string[], string[]>;
    commands: Schema<Schemastery.ObjectS<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>, Schemastery.ObjectT<{
        bind: Schema<string, string>;
        unbind: Schema<string, string>;
        start: Schema<string, string>;
        stop: Schema<string, string>;
        restart: Schema<string, string>;
        kill: Schema<string, string>;
        status: Schema<string, string>;
    }>>;
}>>;
export declare const name = "yxs-pterodactyl";
export declare const description = "\u5BF9\u63A5\u7FFC\u9F99\u9762\u677F Client API\uFF0C\u652F\u6301\u670D\u52A1\u5668\u5B9E\u65F6\u72B6\u6001\uFF08WebSocket\uFF09\u3001\u8D44\u6E90\u76D1\u63A7\u3001\u542F\u505C/\u91CD\u542F/\u5F3A\u5236\u7EC8\u6B62\uFF08\u6307\u4EE4\u524D\u7F00 yxs\uFF09";
export declare const version = "7.0.0";
export declare const author = "yuanxueshi";
export declare const license = "MIT";
