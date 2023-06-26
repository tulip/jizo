# Jizō - Leading Developers Toward a Friendly, Accessible Web for All
This was inspired by another project -- [Koa11y](https://github.com/open-indy/Koa11y).

## What is this?
While working on some a11y audits (many, really) over the years, I quickly began to yearn for a quick and / or dirty way to generate reports utilizing the veritalbe plethora of tools publicly available. In addition to just _making_ the reports, I really wanted to be able to interact with them _immediately_ in a way that was meaningful.

## What can I do with this right now?
[✅] Generate accessibility reports utilizing `@axe-core/cli`.
[✅] View accessibility reports which have been generated utilizing the `@axe-core/cli` tools.
[✅] Generate `.csv` sitemaps, containing a list of all URL's associated with a domain, as determined by the `XML` sitemap.

## What will I be able to do with this in the future?
* Script user journeys to confirm that they are accessible to all users
* Generate accessibility reports for a `.csv` file containing a list of URLs
* Automated visual regression testing on specific URLs or scripted user journeys

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

## I have tried to run a report, but I did not get any output, and worse -- there was an error in the node output!
It's probable that you have enountered an issue where the `chromedriver` versions are mismatched. In these scenarios, perform a clean install of your node modules:

1. Delete your `package-lock.json`
2. Re-install your node packages using `npm install`

This bug will be fixed at a later date.

## Known Issues
See [all known issues](https://github.com/ctangney-tulip/axe-viewer/issues).

## Todo
Wanna help out? Check [this board](https://ctangney.nifty.pm/x5ASEsqABRO5A/home) out to see where you can get started!

## License
MIT
