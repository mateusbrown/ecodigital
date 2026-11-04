@echo off
setlocal
cd /d "%~dp0"

if not exist "dist\" (
	echo A pasta dist nao existe.
	exit /b 1
)

if not exist "docs\" mkdir "docs" || exit /b 1

del /f /q /a "docs\*" 2>nul
for /d %%D in ("docs\*") do rmdir /s /q "%%D"

xcopy "dist\*" "docs\" /E /I /Y /H || exit /b 1
endlocal
