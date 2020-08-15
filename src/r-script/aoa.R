library(plumber)
library(dplyr)
library(sp)
library(rgdal)
library(raster)
library(gdalUtils)
library(CAST)
library(caret)
library(RStoolbox)
library(tiler)
library(base)
setwd('C:/Users/__REPOSITORY_DIR__')

################################################################################
# AOA
################################################################################

#* calulating the AOA and saves tiles to the dist folder
#* @param features the features beeing trainingsdata
#* @get /aoa
function(features={}, name){

training_polygons <- readOGR(dsn = features)

#loading prediction area
predictors <- stack(sprintf('projects/%s.tif',name))
predictors <- aggregate(predictors, 10)

#creating training data
trainDat <- extract(predictors,training_polygons,df=TRUE, fun=mean)
trainDat <- merge(trainDat, training_polygons, by.x="ID", by.y="placeholderId")

AOA <- aoa(train=trainDat, newdata=predictors, variables = names(predictors))
plot(AOA)
writeRaster(AOA, filename= sprintf('projects/%s_aoa.grd',name),bylayer=TRUE, overwrite=TRUE)

#should work without, if path in system variable is available
tiler_options(osgeo4w = "C:/OSGeo4W64/OSGeo4W.bat", python="C:/__PATH_TO_PYTHON__/Python/Python37/python.exe")

tile(file=  sprintf('projects/%s_aoa_2.grd',name),
     tiles= sprintf('dist/static/layers/%s_aoa',name),
     zoom="10-15",
     viewer= FALSE,
)
}

################################################################################
# tiles
################################################################################

#* calulating the AOA and saves tiles to the dist folder
#* @param projectname the name of the project
#* @get /tiles
function(projectname ){

  projectpath <- sprintf("projects/%s.tif", projectname)
  layerpath <- sprintf("dist/static/layers/%s", projectname)
  
tiler_options(osgeo4w = "C:/OSGeo4W64/OSGeo4W.bat", python="C:/__PATH_TO_PYTHON__/Python/Python37/python.exe")
  tile(file= projectpath,
       tiles= layerpath,
       zoom="10-15",
       viewer= FALSE, 
  )
}
