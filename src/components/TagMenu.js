import React from 'react';
import {
  graphql,
  useMutation,
} from 'react-relay';
import { FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import { MultiSelector } from '@meedan/check-ui';

const createTagMutation = graphql`
  mutation TagMenuMutation($input: CreateTagInput!) {
    createTag(input: $input) {
      project_media {
        tags {
          edges {
            node {
              tag_text
            }
          }
        }
      }
    }
  }
`;

const deleteTagMutation = graphql`
  mutation TagMenuDeleteMutation($input: DestroyTagInput!) {
    destroyTag(input: $input) {
      deletedId
      project_media {
        tags {
          edges {
            node {
              tag_text
            }
          }
        }
      }
    }
  }
`;

const TagMenu = ({ projectMedia }) => {
  const selected = projectMedia.tags.edges.map(t => t.node.tag_text);
  const options = projectMedia.team.tag_texts.edges.map(tt => ({ label: tt.node.text, value: tt.node.text }));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commitCreate] = useMutation(createTagMutation);
  const [commitDelete] = useMutation(deleteTagMutation);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (value) => {
    const tags = projectMedia.tags.edges.map(tag => tag.node.tag_text);

    tags.forEach((text) => {
      if (!value.includes(text)) {
        const removedTag = projectMedia.tags.edges.find(tag => tag.node.tag_text === text);
        if (!removedTag) return;

        commitDelete({
          variables: {
            input: {
              id: removedTag.node.id,
            },
          },
          onError: (error) => {
            console.error('Error removing tag'); // FIXME: Implement proper error signaling in Check-Mark
          },
        });
      };
    });

    value.forEach((val) => {
      if (!tags.includes(val)) {
        commitCreate({
          variables: {
            input: {
              tag: val,
              annotated_type: 'ProjectMedia',
              annotated_id: projectMedia.dbid.toString(),
            },
          },
          onError: (error) => {
            console.error('Error creating tag'); // FIXME: Implement proper error signaling in Check-Mark
          },
        });
      }
    });

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <LocalOfferOutlinedIcon />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FormattedMessage id="tagMenu.search" defaultMessage="Search…">
          {placeholder => (
            <MultiSelector
              allowSearch
              inputPlaceholder={placeholder}
              selected={selected}
              options={options}
              onSubmit={handleSelect}
              notFoundLabel={
                <FormattedMessage
                  id="tagMenu.notFound"
                  defaultMessage="No tags found"
                />
              }
              submitLabel={
                <FormattedMessage
                  id="tagMenu.submit"
                  defaultMessage="Tag"
                  description="Verb, infinitive form. Button to commit action of tagging an item"
                />
              }
            />
          )}
        </FormattedMessage>
      </Popover>
    </>
  );
};

export default TagMenu;
