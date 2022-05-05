#----
	Micro Web Server
	@author yc
	Powered by YC
#----

@SCRIPT
#Def _sys;#---标准库
#Def _lmo;
#Def _lmo_ting @com; #---婷婷
#Def const _title lmo-Data-Visualization;
#Def const _webConf [
	>root /dist
	>www www
	>index index.html | index.htm
	>path /
];
#def const _ttConf [
	>listen 80|443|*
	>index _webConf -> _index
];

#Sub
	[]=>
		[] -> _lmo_ting._createError[err [_code] -> [
			#If _code == 4* || == 5*;
					_sys -> _io -> _output[_code];
				#ElseIf _code == 2*
					_next[200];
				#EndelseIf
				#Else
				    _next[];
				#Endelse
			#Endif
		],_next];
	#Endfunc
#End

#Sub
	func load[_t,_l] =>
		#If _t._length != 0
			_sys -> _log[_l];
			#Else
				_sys -> _io -> _output[_t];
			#Endelse
		#Endif
	#Endfunc
#End

#Sub
	[] =>
		load[] -> #Def const f;
			f -> app -> _title = _title;
				_lmo -> _createLmoWebApp[_webConf];
				_lmo_ting._create[];
				_lmo_ting._defConf[_ttConf];
					#Def _server _lmo_ting._createWebServer[];
						_server -> _run[];
					#End
			#Endfunc
	#Endfunc
#End
@SCRIPT END##