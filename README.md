# Comp3006
To create the docker image to run this system open a new terminal in the file containing the code and run the following command.
docker build -t librarysytem .
After the the docker image is created then run the following command to run the image.
docker run -p 3000:3000 -d librarysytem
