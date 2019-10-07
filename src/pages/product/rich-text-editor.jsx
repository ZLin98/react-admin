import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import PropTypes from "prop-types"

class RichTextEditor extends Component {
    static propTypes={
        detail:PropTypes.string
    }
  state = {
    editorState: EditorState.createEmpty(),
  }

  constructor(props) {
    super(props);
    const html = this.props.detail;
    if (html) {
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }
    }else {
        this.state = {
            editorState: EditorState.createEmpty(),
          }
        
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack = (file) => {
    return new Promise(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/manage/img/upload');
          const data = new FormData();
          data.append('image', file);
          xhr.send(data);
          xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            resolve({data :{link:response.data.url}});
          });
          xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
            reject(error);
          });
        }
      );
  }

  //将文本转化成html
  getDetail = () => {
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }
  render() {
    const { editorState } = this.state;
    return (
        <Editor
          editorState={editorState}
          editorStyle={{border:"1px solid black", height:200,paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
    );
  }
}
export default RichTextEditor;
