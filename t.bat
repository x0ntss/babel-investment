@echo off
REM Set your GitHub username and email
git config --global user.name "x0ntss"
git config --global user.email "x0nt.gg@gmail.com"

REM Add the GitHub remote (change if already set)
git remote remove origin
git remote add origin https://github.com/x0ntss/babel-investment.git

REM Add all files and commit
git add .
git commit -m "Initial commit"

REM Push to GitHub (will prompt for username and PAT)
git push -u origin main

pause