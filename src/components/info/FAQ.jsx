import React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

const FAQ = () => {
  return (
    <>
      {" "}
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="What is the AOA?" key="1">
          <p>
            The AOA is the area of applicability and you can acitvate it over
            the layermenu in the top right corner of the map. The AOA calculates
            depending on your project area and the generated trainingdate, which
            regions would be classified trustfully and where traininingdata are
            neede cause these regions are still unknown for the machine. If you
            want more information about the AOA follow the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/HannaMeyer/CAST/blob/master/R/aoa.R"
            >
              link
            </a>
            .
          </p>
        </Panel>
        <Panel header="Why does the map do not show my project-layer?" key="2">
          <p>
            There are current problems with the upload and tiling of the
            project-layers. If your image is not shown in the map it could be a
            problem with the size (max. 1024x1024p) or the band-number. You can
            only upload a GeoTIFF with one band at this point, if you want to
            see yout uploaded file in the map. You can upload bigger files with
            more bands to get a better solution for the AOA-layer because the
            system is prepared to calculate it with higher resolution pictures.
            If you then want to see the layer on map, please contact the
            serveradministration as found in the imprint an the bottom of the
            application.
          </p>
        </Panel>
        <Panel header="Got any further questions?" key="3" disabled>
          <p>
            Contact us! Find the contact data in the imprint at the bottom of
            the application{" "}
          </p>
        </Panel>
      </Collapse>
    </>
  );
};

export default FAQ;
