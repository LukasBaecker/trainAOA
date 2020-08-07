#!/usr/bin/env Rscript

library(plumber)
setwd('C:/Users/__REPOSITORY_DIR__')
r <- plumb("src/r-script/aoa.R")
r$run(port=3002)


