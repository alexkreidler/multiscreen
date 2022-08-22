# multiscreen

```
$ multiscreen --help
Usage: multiscreen [options] [file]

CLI to take screenshots of multiple URLs

Arguments:
  file           provides the list of urls and optionally the screenshot configuration for each (default: "urls.txt")

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

## Format of configuration file

```
url,dimensions
```
where the dimensions are of the form `width*height`

Example:

```
https://data.gov,300*500
```

## Todos

Add ability to set default options in CLI and not include in config file
Possibly use different browsers