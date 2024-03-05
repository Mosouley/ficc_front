# Dockerfile

# pull official base image
FROM alpine:3.18 as  builder

# set work directory
RUN mkdir  /app
WORKDIR /app

#Copy app dependencies
COPY ficc_front/package.json ficc_front/package-lock.json /app/
# install dependencies
RUN npm install --prefix ficc_front

# Copy app files.
COPY . /src/app
# Build app
RUN npm run build --prefix ficc_front --output-path=./dist/out

# run entrypoint.sh
# ENTRYPOINT ["/treasurysystem/entrypoint.sh"]
# EXPOSE 8000

# runs the production server
# ENTRYPOINT ["python", "treasurysystem/manage.py"]
# CMD ["runserver", "0.0.0.0:8000"]
