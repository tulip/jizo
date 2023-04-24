# Some-nameless-tool-to-make-a11y-reports-and-view-them
Very aptly named! 😅

This was inspired by another project -- [Koa11y](https://github.com/open-indy/Koa11y). I don't have a cute name 😞

## What is this?
While working on some a11y audits (many, really) over the years, I quickly began to yearn for a quick and / or dirty way to generate reports utilizing the veritalbe plethora of tools publicly available. In addition to just _making_ the reports, I really wanted to be able to interact with them _immediately_ in a way that was meaningful.

## Cool. What does... that mean?
If you've worked with tools like `@axe-core/cli`, you will be all too familiar with the process of sifting through cryptic JSON reports in order to figure out what your scan turned up. In the distant future, humans will probably be equipped with some JSON parsing library, capable of reading these reports at a glance. Until such a time, I wanted to devise a way to display this information in human-digestable chunks 😆

## Neat!
If you're interested in getting started with this tool, there are a few things to keep in mind before proceeding.

_First and foremost_, functionality is limited. Right now, users can only output reports to a pre-determined location on the client's file system. This build should be considered __pre-alpha__.

## Nitty-gritty! (Quickstart)
Let's get started by cloning the repo. Once you have done that, let's run:

```
npm install
```

This will install our required dependencies -- the key piece being our `@axe-core/cli`! If you are interested in what else this project is built on, go ahead and take a glance at the package.json.

That's it! F*cking crazy, I know!

To get started, just run:

```
npm start
```

## Known Issues
See [all known issues](https://github.com/ctangney-tulip/axe-viewer/issues).

## Todo
- [x] ~~Disable the inputs for the `axe__create-report` form during generation~~
- [x] ~~Add toast functionality~~
- [x] ~~Add a toast specifically for notifying the user that a report is done~~
- [ ] Make it so a user can clear the report without having to refresh the page
- [ ] Flesh out the object that is used to display the data from the report (add more than just errors)
- [x] ~~Make it so you can control output directory with the `.env` file~~
- [x] ~~Move component registry into its own file so that the main doesn't get stupid f*cking big~~
- [ ] Figure out a basic "setup" process (define save location, etc)
- [x] ~~Update readme to include reference to https://github.com/open-indy/Koa11y~~
- [x] ~~Check for sitemap at URL; create CSV if it exists~~
- [ ] Scan CSV file of URLs
- [x] ~~Add "system tray" so users can follow the node output~~
- [ ] Theme / style / design work
- [ ] Iconography
- [ ] Integrate `sitespeed.io` functionality
- [ ] Integrate `lighthouse` functionality
- [ ] Integrate `puppeteer` for functional testing

## License
MIT
