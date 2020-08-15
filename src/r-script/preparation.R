library(sp)
library(rgdal)
library(raster)
library(gdalUtils)
library(caret)
library(RStoolbox)
library(tiler)

setwd('C:/Users/__REPOSITORY_DIR__')

################################################################################
# Data preparation
################################################################################

#stack JPEG2000
sentinel_west <- stack('__PATH_TO__/T32ULC_20200427T104031_B02.jp2',
                      '__PATH_TO__/T32ULC_20200427T104031_B03.jp2',
                      '__PATH_TO__/T32ULC_20200427T104031_B04.jp2',
                      '__PATH_TO__/T32ULC_20200427T104031_B08.jp2')

sentinel_east <- stack('__PATH_TO__/T32UMC_20200427T104031_B02.jp2',
                      '__PATH_TO__/T32UMC_20200427T104031_B03.jp2',
                      '__PATH_TO__/T32UMC_20200427T104031_B04.jp2',
                      '__PATH_TO__/T32UMC_20200427T104031_B08.jp2') 

# crop to the extent of the study area
west_crop <- crop(sentinel_west,c(390309.5, 418741.3, 5746125.4,5768919.6))
east_crop <- crop(sentinel_east,c(390309.5, 418741.3, 5746125.4,5768919.6))
# create a mosaic of both tiles
combined <- mosaic(west_crop,east_crop,fun=mean)

writeRaster(combined,filename = '/data/___PROJECTNAME___.tif',
            overwrite=TRUE)
