import { useMemo, useState } from 'react';
import { Tabs, Upload, UploadFile, message } from 'antd';
import cx from 'classnames';
import * as XLSX from 'xlsx';
import { EmptyContent } from '../../components/EmptyContent';
import { InboxOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { UploadChangeParam } from 'antd/es/upload';
import { PreviewContent } from './PreviewContent';

import * as styles from './index.module.less';

const { Dragger } = Upload;

interface ParseCSVProps {
  className?: string;
}

export const ParseCSV: React.FC<ParseCSVProps> = (({
  className
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [sheets, setSheets] = useState<any[]>([]);

  const tabItems = useMemo(() => {
    return sheets?.map((item, index) => {
      return {
        key: String(index + 1),
        label: item?.title,
        children: (
          <PreviewContent data={item?.data} />
        ),
      }
    })
  }, [sheets]);

  const beforeUpload = useMemoizedFn((info) => {
    const reader = new FileReader();
    reader.onload = (e: Event) => {
      try {
        // @ts-ignore
        const datas = e?.target?.result;
        
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(datas, { type: 'binary' });
        
        const sheetList = Object.keys(workbook?.Sheets ?? {}).reduce((arr: any[], sheet) => {
          arr.push({
            title: sheet,
            data: XLSX.utils.sheet_to_json(workbook?.Sheets?.[sheet]),
          })
          return arr;
        }, []);
        setSheets(sheetList);
      } catch (error) {
        // error
        message.error('文件格式错误')
      }
    }

    reader.readAsBinaryString(info);
  })

  const onChange = useMemoizedFn(({ file }: UploadChangeParam) => {
    if (file?.status === 'removed') {
      setFileList([]);
      return;
    }
    setFileList([{ ...file, status: 'done' }])
  });

  const onRemove = useMemoizedFn(() => {
    setSheets([]);
    setFileList(undefined);
  });

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.left}>
        <Dragger
          height={160}
          multiple={false}
          accept='.xls,.xlsx,application/vnd.ms-excel'
          fileList={fileList}
          beforeUpload={beforeUpload}
          onRemove={onRemove}
          onChange={onChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            单击或拖拽文件到此区域进行上传
          </p>
          {/* <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p> */}
        </Dragger>
      </div>
      <div className={styles.content}>
        {
          sheets?.length ? (
            <div>
              <Tabs
                defaultActiveKey='1'
                items={tabItems}
              />
            </div>
          ) : (
            <EmptyContent style={{ marginTop: '35vh' }}/>
          )
        }
      </div>
    </div>
  )
});
