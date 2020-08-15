library(raster)
library(rgdal) 
library(sf)
library(caret)
library(mapview)
setwd('C:/__DIR__')

################################################################################
# classification
################################################################################
# based on: https://github.com/HannaMeyer/Geostat2018/tree/master/practice

sentinel <- stack("___PROJECTNAME___.tif")
## shapefile of the training site prepared in QGIS
training<- read_sf("___YOURREPAIREDFILE___.shp") 

extr <- extract(sentinel, training, df=TRUE)
extr <- merge(extr, training, by.x="ID", by.y="fid")
head(extr)

set.seed(100)
trainids <- createDataPartition(extr$placeholde,list=FALSE,p=0.3)
trainDat <- extr[trainids,]
testDat <- extr[-trainids,]

predictors <- c("layer.1","layer.2","layer.3", "layer.4")
response <- "placeholde"

set.seed(100)
model <- train(trainDat[,predictors],trainDat[,response],method="rf",
               trControl=trainControl(method="cv"),importance=TRUE)
print(model)
plot(model)
plot(varImp(model))
prediction <- predict(sentinel,model)
writeRaster(prediction, filename = "data/classifiedSECOND", format = "GTiff", options=c("COMPRESS=NONE", "TFW=YES"), overwrite = TRUE)
spplot(prediction,col.regions=c("brown","yellow","darkgreen","green","black","blue"), maxpixels=1000000)

pred_valid <- predict(model,testDat)
table(testDat$class,pred_valid)
