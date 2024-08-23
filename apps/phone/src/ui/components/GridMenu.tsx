import React, { Fragment } from 'react';
import { AppIcon } from './AppIcon';
import { Box, Grid, GridSize } from '@mui/material';
import { Link } from 'react-router-dom';
import { IApp } from '@os/apps/config/apps';

interface GridMenuProps {
  items: IApp[];
  Component?: React.ElementType;
  xs?: GridSize;
}

export const GridMenu: React.FC<GridMenuProps> = ({ items, Component = AppIcon, xs }) => {
  const appsFront = ["DIALER", "BROWSER", "CAMERA", "MESSAGES"];
  return (
    <Grid container alignItems="center" direction="row">
      {items &&
        items.length &&
        items.map((item) => {
          if (!appsFront.includes(item.id)) {
            return (
              <Fragment key={item.id}>
                {!item.isDisabled && (
                  <Grid item xs={xs} key={item.id}>
                    <Box textAlign="center">
                      <Link to={item.path}>
                        <Component {...item} />
                      </Link>
                    </Box>
                  </Grid>
                )}
              </Fragment>
            )
          }
        })}
    </Grid>
  );
};
