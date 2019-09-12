# 镜像来源
FROM onlyoffice/documentserver:5.2.8.24

# 导入
#COPY html/proxy.html /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/
#COPY js/api.js /var/www/onlyoffice/documentserver/web-apps/apps/api/documents
COPY html/index.html /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/

# 删除其他字体
RUN rm -rf /usr/share/fonts/**.ttf
RUN rm -rf /usr/share/fonts/truetype/dejavu/**.ttf
RUN rm -rf /var/www/onlyoffice/documentserver/core-fonts/**

# 导入中文字体
COPY font /usr/share/fonts/winfont

# 导入中文翻译，纠正翻译错误
COPY json/zh.json /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/locale/
COPY json/Contents.json /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/

# 增加本地ccs文件
ADD css/app.css /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/css/app.css.temp
RUN cat /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/css/app.css.temp >> /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/css/app.css
RUN rm -rf /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/css/app.css.temp

# 帮助文档,待翻译
RUN cp -r /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/en/callback.js /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/
RUN cp -r /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/en/images /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/
RUN cp -r /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/en/UsageInstructions /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/
RUN cp -r /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/en/editor.css /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/

RUN cp /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/en/UsageInstructions/* /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/UsageInstructions/

# 删除插件
RUN ls /var/www/onlyoffice/documentserver/sdkjs-plugins/* -ld | grep ^d | xargs rm -rf

#手写板插件暂时注释掉 
COPY plugins/ /var/www/onlyoffice/documentserver/sdkjs-plugins/

# 修改文件用户
RUN chown onlyoffice:onlyoffice /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/locale/*
RUN chown onlyoffice:onlyoffice /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/*
RUN chown onlyoffice:onlyoffice /usr/share/fonts/*

# 修改用户数20的限制,修改转换数量的限制
RUN sed -i  "s/LICENSE_CONNECTIONS = 20/LICENSE_CONNECTIONS = 500/" /var/www/onlyoffice/documentserver/server/Common/sources/constants.js
RUN sed -i  "s/count = 1/count = 100/" /var/www/onlyoffice/documentserver/server/Common/sources/license.js

# 去除拼写检查
# RUN sed -i  "s/= values;/= ('spell' === data.type ? true : values);/" /var/www/onlyoffice/documentserver/server/SpellChecker/sources/spellCheck.js
# RUN sed -i  "s/conn.write/\/\/conn.write/" /var/www/onlyoffice/documentserver/server/SpellChecker/sources/spellCheck.js

RUN sed -i  "s/promises.push/promises.push(true);\/\//" /var/www/onlyoffice/documentserver/server/SpellChecker/sources/spellCheck.js

RUN fc-cache -f -v && /usr/bin/documentserver-generate-allfonts.sh 
EXPOSE 80 443
VOLUME /etc/onlyoffice /var/log/onlyoffice /var/lib/onlyoffice /var/www/onlyoffice/Data /var/lib/postgresql /usr/share/fonts/truetype/custom

CMD bash -C '/app/onlyoffice/run-document-server.sh';'bash'
