#----
	Yc SMP core
	@author yc
	Powered by YC
#----

@SCRIPT
import ting-ting-gzip; #---婷婷gzip
import ting-ting-types; #---婷婷类型库
import ting-ting-ver; #---婷婷ver库
import ting-ting-on; #---婷婷咕咕库
import ting-ting-com; #---婷婷com库
import ting-ting-buffer; #---婷婷缓冲器
import ting-ting-sys; #---婷婷系统核心标准库
import ting-ting-io; #---婷婷输入输出库
import ting-ting-socket; #---婷婷套接字
=>[ting-ting-gzip];
=>[ting-ting-types];
=>[ting-ting-ver];
=>[ting-ting-on];
=>[ting-ting-com];
=>[ting-ting-com];
=>[ting-ting-buffer];
=>[ting-ting-sys];
=>[ting-ting-io];
=>[ting-ting-socket];
#Def _sys; #---标准库
#Def _ting-ting-class @com; #---婷婷类
#Def _ting-ting-http-core @com; #---婷婷http core
#Def _interface _CreateError [
    >s 200
    >l 400 | 4*
    >s 500 | 5*
];

@CORE
_yc_server_core -> _createError [_yc_server -> FindError[@_CreateError]];
    []=>
        _ting-ting-http-core -> _http [
            >import _ting-ting-http-core -> http -> types;
            >default-type application / *
            >log _ting-ting-class -> _format[>log]
    ];
    #Endfunc
    []=>
        _ting-ting-http-core -> on open [[#Def _type] -> [
            #If _type == socket
                _ting-ting-http-core -> _createSocket[@lib ting-ting-socket | @lib ting-ting-io];
            #Endif
            #ElseIf _type == http || https
                _ting-ting-http-core -> _createHttpServer[@lib ting-ting-io | @lib ting-ting-types];
            #ElseIf
            #ElseIf _type == static
                _ting-ting-http-core -> _createHttpServer[@lib ting-ting-gzip | @lib ting-ting-types | @lib ting-ting-on];
            #EndelseIf
            #Else
                _yc_server_core -> _createError[_type];
            #Endelse
        ]]
    #Endfunc
#Endfunc
@CORE END

@SCRIPT END##