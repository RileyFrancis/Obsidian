SSH into the remote server using `ssh -p 2220 bandid{#}@bandit.labs.overthewire.org`, where `{#}` is the level number. You can find the password for these levels in [[Passwords]].

### 1
Dashed filenames can cause an issue in linux because they are often mistaken for flags. For example, `cat -` will not do anything because the `'-'` is interpreted as the start of a flag. You must use `./-` instead.
### 8
`uniq` will filter out all duplicate values within a file that appear next to each other. You can combine this with `sort` to find unique occurrences of a line.