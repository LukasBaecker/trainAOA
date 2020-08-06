# trainAOA
trainAOA is a webapplication for efficient and collaborative generation of trainingdate for satelliteclassification based on maschine learning.
The generation is supported by a maplayer which shows the AOA (area of applicability) provided by the AOA-algorithm in Meyers [CAST-Package](https://github.com/HannaMeyer/CAST). 

## Getting Started
Clone this repository or copy it to a folder.

Then you need some basedata for your project. 
This thesis uses two airial Sentinel2 pictures downloaded from the * [EartzhExplorer](https://earthexplorer.usgs.gov/).
To follow the thesis, download the area of Münster with these two pictures:

  * L1C_T32ULC_A025316_20200427T104347
  * L1C_T32UMC_A025316_20200427T104347

Once you downloaded them, you can start the preparation.r file. With help of this you can prepare these two images for the application resulting in rastertiles perfectly fitted for the used leaflet-map.
When you are done preparing your projectarea, start the application:

### Prerequisites

To make sure everything is running fine, install following software on your operating system. You will find the used version of each tool. Feel free to use other versions but there is no guarantee that no further problems will arise.
What you need:

  * R-Studio
  * nodeJS (v12.16.3)
  * mongodb (Version 4.2.0)
  * python (Version 3.7.7) with
    * GDAL (Version 3.0.2) installed with [osgeo4w](https://trac.osgeo.org/osgeo4w/)

### Installing

To get the app running after cloning or downloading it make sure, that all fileconnections are correct. 

Then you have to prepare the R-Scripts at /src/r-script for usage. Check the fileconnections and make sure to link the directories to the directory of the repository.
Make then sure to install all needed packages in the aoa.R file and the plumberAPI.R file.
Then run the plumberAPI.R script and the plumber-API will start. It's now ready to use and the actual app can run its functions.

Then change to the console and navigate to the repositorys folder. Then run:

```
npm run build
```

After buildung you are finally ready to start and enjoy the application:

```
npm start
```

Here are some advices you currently should know about:

## tiler and environment variables
While testing the application there where some issues with tiler running in the R-script. Therefor i had to set the tiler.options to find the needed files. If they are set as path as in the tiler documentation shown it should work but for me it didn't.
So keep that in mind and watch out.

## Using QGIS-tiles instead of 
If you build a new project and you have access to the server-folder you can easiely change files as you wish.
The current version of this app does not support investigation area maps, that got more than one band. If you would like to see a multiband rasterlayer on the leaflet map you have to insert the project tiles manually.
For testing purpose, I used to generate tiles with QGIS and the 'Generate XYZ tiles'-tool. Here you have the option to take high resolutions and change the zoomlevels of the tiles.
Mind that lower zoomlevels take much longer to generate because of the high amount of created tiles.

When generating is done you can just update the files of your chosen project in the dist/layers/PROJECTNAME folder.

Keep in mind that tiler generates TMS-tiles and the tilelayers have a parameter named tms that is set "true" to handle that. If you use 'Generate XYZ tiles' in QGIS check the TMS box to avoid possible mistakes. Or you could channge the tms-parameter in the Map.jsx file:

```
<BaseLayer checked name="investigation area">
  <TileLayer
    attribution="&copy;  contributors"
    url={
      "/static/layers/" +
      currentProject.projectname +
      "/{z}/{x}/{y}.png"
    }
    tms="true"
    minZoom="10"
    maxZoom="18"
  />
</BaseLayer>
```

## Running the tests

NOT YET IMPLEMENTED

To run the test:

```
npm test
```


## Built With

* [nodeJS](https://nodejs.org/en/)
* [Express](https://expressjs.com/de/)
* [Webpack](https://webpack.js.org/)
* [React](https://reactjs.org/)
* [MongoDB](https://www.mongodb.com/de)
* [Bootstrap](https://getbootstrap.com/)
* [Babel](https://babeljs.io/)

...and many more


## Authors

* **Lukas Bäcker** - *Initial work* - [LukasBäcker](https://github.com/LukasBaecker)

## License

MIT License

Copyright (c) 2020 Lukas Bäcker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

* Christian Knoth 
* Hanna Meyer (https://github.com/HannaMeyer)

