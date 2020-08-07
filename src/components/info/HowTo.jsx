import React from "react";

const HowTo = () => {
  return (
    <>
      <p>
        <b>What is this App about?</b>
        <br />
        Create a project, join one and start generating trainingdata. That is
        what this webapplication is all about. But it does it in a unique way.
        In a efficiant and collaborative way. It uses the AOA-method to show you
        where to go and do not get lost somewhere. Just follow these few steps
        and you will know how to run this thing:
      </p>
      <p>
        <b>create a project</b>
        <br />
        To create a project, click on your user-icon in the upper-right corner
        and go to "manage projects". Here you can also find and follow other
        projects
      </p>
      <p>
        <b>generate trainingdata</b>
        <br />
        To generate trainingdata, go to the map, the start-page and choose the
        project you want to work on. Then you can start collecting data on the
        interactive map. Use the AOA-layer as a helper to orientate yourself in
        the project. The orange regions show a lag of trainingdata. So start
        picking up a polygon here. The purple location is the AOA and ready to
        start a classification. If the whole project are is painted purple, you
        will have all what you need to classify your project.
      </p>
      <p>
        <b>update the AOA</b>
        <br />
        When you draw a polygon, there will be a PupUp...popping up. Here you
        can choose the right class for your drawing. Finally save the polygon
        and a magic button will appear. The heart of the application. With its
        power you can load or reload the area of applicability which was just
        mentioned. For more information see the imprint or the FAQs.
      </p>
      <p>Thanks for using trainAOA</p>
    </>
  );
};

export default HowTo;
