
========
Overview
========

Sphinx TYPO3 theme for docs.typo3.org
=====================================
.. BADGES_START

.. image:: https://raw.githubusercontent.com/typo3-documentation/sphinx_typo3_theme/master/img/screenshot.png
   :alt: Sphinx TYPO3 theme screenshot

.. image:: https://github.com/TYPO3-Documentation/sphinx_typo3_theme/workflows/CI/badge.svg
   :alt: CI
   :target: https://github.com/TYPO3-Documentation/sphinx_typo3_theme/actions?query=workflow%3ACI

.. BADGES_END

Sphinx TYPO3 theme contains all files required to build a Sphinx extension that
provides the theme.

* Maintainer: Martin Bless <martin.bless@mbless.de>
* Provided by the TYPO3 documentation team.
* Free software: MIT license
* Authors: See AUTHORS.rst
* Repository: https://github.com/TYPO3-Documentation/sphinx_typo3_theme
* Documentation: See docs/ folder and https://typo3-documentation.github.io/sphinx_typo3_theme/


Credits
-------

`Benjamin Kott`_ has created this theme from scratch without dependencies to
Sphinx themes or the `ReadTheDocs theme`_. Thank you very much, great work!

The ancestor of this package is `t3SphinxThemeRtd`_ which had been developed
by `Martin Bless`_ as a derivative of the ReadTheDocs theme.

.. _Benjamin Kott: benjamin.kott@outlook.com
.. _Martin Bless: martin.bless@mbless.de
.. _ReadTheDocs theme: https://github.com/readthedocs/sphinx_rtd_theme
.. _t3SphinxThemeRtd: https://github.com/typo3-documentation/t3SphinxThemeRtd


Releasing
---------
Make sure to specify all three numbers as in 'v99.88.77'.


Feature demonstration
---------------------

There also is a `demo manual <https://typo3-documentation.github.io/sphinx_typo3_theme_rendering_test/>`__
which serves as a "stress test" for the theme and shows what markup is possible and
how it gets rendered.


Development
-----------

We are using Ubuntu (22.04) for development with `Python3
<https://www.python.org/>`_ installed. Further we are using GNU `make <https://www.mankier.com/1/make>`_
for convenience.
Next we are using the `Node Version Manager (NVM)
<https://github.com/nvm-sh/nvm>`_ to install and activate Node version v12::

   ❯ nvm install 12
   ❯ nvm ls          # list installed version
   ❯ nvm use v12     # activate


We also need `Yarn <https://yarnpkg.com/>`_ and `Grunt
<https://gruntjs.com/>`_. Let's install these globally::

   ❯ npm install -g yarn
   ❯ npm install -g grunt

Clone the repository::

   ❯ git clone https://github.com/TYPO3-Documentation/sphinx_typo3_theme/

Further steps::

   ❯ cd sphinx_typo3_theme  # go there
   ❯ make                   # see what options you have
   ❯ cat Makefile           # read for understanding
   ❯ cat Gruntfile.js       # read for understanding

Use Node version v12, show Python version::

   ❯ nvm use v12
   Now using node v12.22.12 (npm v6.14.16)

   ❯ python --version
   Python 3.10.6

Install the Python modules, install the Node modules and build
everything::

   make setup buildall

Repeat as you like::

   make buildall

Look at folder `./dist` to find the build results::

   ❯ ls ./dist

Example output::

   ./dist/sphinx_typo3_theme-4.7.10.dev1+gc7ebb3d.d20230426-py2.py3-none-any.whl
   ./dist/sphinx_typo3_theme-4.7.10.dev1+gc7ebb3d.d20230426.tar.gz

You may study as well the GitHub workflows of this repository.

Restrictions
------------

This theme has not been used or tested with Sphinx versions that are
newer than Sphinx-4.5.0.

What else?
----------

Have fun!
