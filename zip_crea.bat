@REM :: genera un backup de los fuentes con 7zip
@echo off
::7z a -tzip archive.zip @listfile.txt
SET ZIP="C:\Program Files\7-Zip\7z.exe"

::------------------
::SET formato="ESP"
SET formato="ESP_1" 

SET da=%date%
SET ti=%time%

IF %formato% == "ESP" GOTO fecha_espanol
IF %formato% == "ING" GOTO fecha_ingles
IF %formato% == "ESP_1" GOTO fecha_simple

:fecha_simple	
	::07/06/2023  8:17:18,46
	::012345678901234567890123456

	SET dd=%da:~0,2%
	SET mm=%da:~3,2%
	SET aa=%da:~6,4%
	SET hh=%ti:~0,2%
	SET mi=%ti:~3,2%
	SET ss=%ti:~6,2%
	if "%hh:~0,1%" == " " SET hh=0%hh:~1,1%
	
	GOTO continuar
:fecha_espanol
	::lun. 05/04/2021_ 7:23:23.59
	::lun. 22/03/2021_18:17:07.95
	::012345678901234567890123456
	
	SET dd=%da:~5,2%
	SET mm=%da:~8,2%
	SET aa=%da:~11,4%
	SET hh=%ti:~0,2%
	SET mi=%ti:~3,2%
	SET ss=%ti:~6,2%
	if "%hh:~0,1%" == " " SET hh=0%hh:~1,1%
	
	GOTO continuar
goto:eof

:fecha_ingles
	::t=2021-07-26_20:11:39.41
	::da=2021-07-26
	::ti=21:20:16.71
	:: t=012345678901234567890123
	:: NOTA: si las variables tiene espacios o TAB a derecha se incluira en el nombre
	SET aa=%da:~0,4%
	SET mm=%da:~5,2%
	SET dd=%da:~8,2%
	SET hh=%ti:~0,2%
	SET mi=%ti:~3,2%
	SET ss=%ti:~6,2%
	if "%hh:~0,1%" == " " SET hh=0%hh:~1,1%

	GOTO continuar
goto:eof


:continuar	
	SET d=%aa%%mm%%dd%_%hh%%mi%%ss%
	SET NOMBRE=eatmain_%d%.zip
	
	::%ZIP% a -tzip %NOMBRE% *.sln *.txt *.json *.js *.bat -i!styles -ir!.vs -ir!AlaCartaMoz\*.*  -xr!AlaCartaMoz\Client\bin -xr!AlaCartaMoz\Client\obj -xr!AlaCartaMoz\Server\bin -xr!AlaCartaMoz\Server\obj -xr!AlaCartaMoz\Shared\bin -xr!AlaCartaMoz\Shared\obj add
	::echo Listo
	::-ir!.vs\*.*
	
	%ZIP% a -tzip %NOMBRE% .\*.* .\Dockerfile -x!*.zip -x!*.rar -x!.vs*  -ir!public\*.* -ir!src\*.* -xr!.vscode -xr!build

	
	echo Archivo generado %NOMBRE%
	echo Listo
	pause 


:: Agrega al archivo src.zip todos los archivos *.txt del directorio actual y 
:: todos los archivos *.cpp del directorio DIR1 y de todos sus subdirectorios
:: (r=recursivo) (i=ncluye nombre de archivos)
:: (-xr!= excluye las carpetas y sus contenidos)
::7z a -tzip src.zip *.txt -ir!DIR1\*.cpp add
