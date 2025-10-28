@echo off
chcp 65001 >nul
echo ========================================
echo   推送VitalWealth到GitHub
echo ========================================
echo.

cd /d D:\VitalWealth

echo [1/6] 配置Git分页器...
git config core.pager ""
echo 完成！
echo.

echo [2/6] 添加所有文件...
git add .
echo 完成！
echo.

echo [3/6] 提交到本地仓库...
git commit -m "Initial commit: VitalWealth minimalist blog website with organized documentation"
echo 完成！
echo.

echo [4/6] 重命名分支为main...
git branch -M main
echo 完成！
echo.

echo [5/6] 推送到GitHub...
git push -u origin main
echo.

echo ========================================
echo   推送完成！
echo ========================================
echo.
echo 项目已成功推送到:
echo https://github.com/kydomain1/VitalWealth
echo.
echo 按任意键关闭窗口...
pause >nul


