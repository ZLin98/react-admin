import { Upload, Icon, Modal, message } from 'antd';
import React from "react"
import { reqDeleteImage } from "../../api/index"
import ProprTypes from "prop-types"
import {BASE} from "../../utils/constants"

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {

    static propTypes = {
        imgs: ProprTypes.array
    }

    constructor(props) {
        super(props);
        //初始化状态
        const {imgs} = props;
        let fileList = [];
        if(imgs && imgs.length > 0) {
            fileList = imgs.map((img,index) => ({
                uid: -index, //建议设置负值，防止和内部生成的冲突
                name: img,
                status: 'done',
                url: BASE + img,
            
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: fileList,
        }
    }

    getImgs = () => {
        return this.state.fileList.map(x => x.name)
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        if (file.status === "done") {
            const result = file.response;
            if (result.status === 0) {
                message.success("上传图片成功")
                const { name, url } = result.data;
                //注意，这里的file和fileList不是同一个对象
                file = fileList[fileList.length - 1]
                file.name = name;
                file.url = url;
            } else {
                message.error("上传图片失败")
            }
        } else if (file.status === "remove") {
            const result = await reqDeleteImage(file.name);
            if (result.status === 0) {
                message.success("删除图片成功");
            } else {
                message.error("删除图片失败")
            }
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    accept="image/*" //只接受图片
                    name="image" //请求后天参数名
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;