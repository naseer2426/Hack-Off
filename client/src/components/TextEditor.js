import React, { PureComponent } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";

class TextEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  modeSelector = () => {
    let mode = this.props.mode;
    if (mode === "C" || mode === "C++") {
      mode = "java";
    }
  };
  onChange = value => {
    this.props.setCode(value);
  };
  render() {
    return (
      <AceEditor
        mode={this.props.mode}
        theme="twilight"
        onChange={this.onChange}
        name="UNIQUE_ID_OF_DIV"
        fontSize={15}
        showPrintMargin={true}
        style={{
          width: "850px",
          opacity: 0.9,
          color: "white"
        }}
        value={this.props.code}
        onChange={this.onChange}
        showGutter={true}
        highlightActiveLine={true}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4
        }}
      />
    );
  }
}

export default TextEditor;
