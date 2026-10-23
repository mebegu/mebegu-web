---
title: 'Pocket Archive: remembering why you saved a link'
description: Building a reading queue from links, short notes and a few tags.
published: 2026-10-23
category: Software
draft: false
lang: en
translationKey: pocket-archive
translatedFrom: cep-arsivi
---

Saving a link is easy. Remembering why you saved it a week later is harder. Pocket Archive starts with that small gap: keep the thought alongside the address.

The first version has three basic parts: a title, a link and a short note. Tags let you group things without building a folder hierarchy. Search looks through titles, notes and tags. After reading something, you can remove it or keep it marked as read.

## Keeping it small

This version has no account or server. Entries live in the browser's local storage. They survive a page reload but do not automatically appear in another browser. JSON export gives you a simple way to take your data out. Restoring an archive from JSON is a next step.

The app does not fetch saved links in the background. You write the titles and notes yourself; saving a site does not send it a preview or tracking request. Opening a saved link takes you to that website in a new tab.

## Interface choices

The entry form and reading queue sit side by side on a desktop and stack on a phone. Each entry shows its title, the reason you kept it and its reading status. Returning to the link is the main action; the remaining controls stay small.

The Workshop project page follows the same order: what it does, a way to try it, then the details. The archive-drawer and reading-card illustrations give the idea a visual form; the app images were captured from the working page.

This is a small browser tool rather than a replacement for a reading service across devices. The next step is to use the existing flow and see what is missing before adding more fields.
