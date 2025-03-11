FROM beevelop/ionic:latest
WORKDIR /www/app
COPY . /www/app
EXPOSE 8100
ENTRYPOINT ["ionic"]
CMD ["serve", "--external", "--no-open"]