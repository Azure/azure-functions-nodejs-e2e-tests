E2E tests are failing in this branch with assertion errors (500 != 400).
Can you do a deep dive and investigate why its failing? We've tried multiple ways to fix it (check commit history) but nothing seems to work. Also, the runs from `main` branch are succeeding so the bug is somewhere in this branch and in this code. Can you investigate and fix please?

 Here are full logs from the bad E2E run - https://azfunc.visualstudio.com/ae7e3bf3-d41a-4480-9ac0-b6cf9df9ac24/_apis/build/builds/277790/logs/97
Here are the full logs from the good E2E run from main branch - https://azfunc.visualstudio.com/ae7e3bf3-d41a-4480-9ac0-b6cf9df9ac24/_apis/build/builds/277740/logs/94