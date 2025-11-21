***Riley Francis - rif17002***
- - -
![[Assignment_8.pdf]]
# Recurrent Neural Networks
### 1.
##### a. 
Since there are just two characters $A$ and $B$, their one-hot vectors will be $$A=\left[\matrix{1\\0}\right]\;\;\;B=\left[\matrix{0\\1}\right]$$
##### b.
We have:
$$h_t=\tanh(W_hh_{t-1}+W_xx_t+b_h)$$
So, assuming $h_0=0$, $h_1$ will become:$$h_1=\tanh\left(\left[\matrix{1&0&1 \\ -1&1&0 \\ 0&2&-1}\right](0) + \left[\matrix{1&-1 \\ 0&2 \\ -1&1}\right]\left[\matrix{1\\0}\right]+0\right)=\tanh\left(\left[\matrix{1\\0\\-1}\right]\right)\approx\left[\matrix{0.762\\0\\-0.762}\right]$$
$h_2$ will become:$$h_2=\tanh\left(\left[\matrix{1&0&1 \\ -1&1&0 \\ 0&2&-1}\right]\left[\matrix{0.762\\0\\-0.762}\right] + \left[\matrix{1&-1 \\ 0&2 \\ -1&1}\right]\left[\matrix{0\\1}\right]+0\right)=\tanh\left(\left[\matrix{-1\\1.238\\1.762}\right]\right)\approx\left[\matrix{-0.762\\0.845\\0.943}\right]$$
$h_3$ will become:$$h_3=\tanh\left(\left[\matrix{1&0&1 \\ -1&1&0 \\ 0&2&-1}\right]\left[\matrix{-0.762\\0.845\\0.943}\right] + \left[\matrix{1&-1 \\ 0&2 \\ -1&1}\right]\left[\matrix{1\\0}\right]+0\right)=\tanh\left(\left[\matrix{1.181\\1.607\\-0.253}\right]\right)\approx\left[\matrix{0.828\\0.923\\-0.247}\right]$$
##### c.
We have:$$\hat y_t=\text{softmax}(W_yh_t+b_y)$$
$\hat y_1$ will become:$$\hat y_1=\text{softmax}\left(\left[\matrix{1&-1&0\\0&2&-1}\right]\left[\matrix{0.762\\0\\-0.762}\right]+0\right)=\text{softmax}\left(\left[\matrix{0.762\\0.762}\right]\right)=\left[\matrix{0.5\\0.5}\right]$$
$\hat y_2$ will become:$$\hat y_2=\text{softmax}\left(\left[\matrix{1&-1&0\\0&2&-1}\right]\left[\matrix{-0.762\\0.845\\0.943}\right]+0\right)=\text{softmax}\left(\left[\matrix{-1.607\\0.747}\right]\right)=\left[\matrix{0.087\\0.913}\right]$$
$\hat y_3$ will become:$$\hat y_2=\text{softmax}\left(\left[\matrix{1&-1&0\\0&2&-1}\right]\left[\matrix{0.828\\0.923\\-0.247}\right]+0\right)=\text{softmax}\left(\left[\matrix{-0.095\\2.093}\right]\right)=\left[\matrix{0.101\\0.899}\right]$$
##### d.
The model will predict $B$ after $t=3$ with $89.9\%$ confidence.

### 2.
We know the following:$$\begin{align}h_t&=\tanh(W_hh_{t-1}+W_xx_t+b_h) \\ \hat y_t&=\text{softmax}(W_yh_t+b_y)\end{align}$$Let $\sum_kL_k$ be the total loss over all time steps. We want to find $\frac{\partial L}{\partial h_t}$. This term can be expressed as the sum of direct path and the indirect path. So through the chain rule, we have:$$\frac{\partial L}{\partial h_t}=\frac{\partial L_t}{\partial h_t}+\frac{\partial L}{\partial h_{t+1}}\frac{\partial h_{t+1}}{\partial h_t}$$
For the direct path term, we pass through $o_t$, so $\frac{\partial L_t}{\partial h_t}$ can be written as $$\frac{\partial L_t}{\partial h_t}=\frac{\partial L_t}{\partial o_t}\frac{\partial o_t}{\partial h_t}$$Then, $\frac{\partial L_t}{\partial o_t}=\hat y_t-y_t$ and because $o_t=W_yh_t+b_y$, $\frac{\partial o_t}{\partial h_t}=W_y$, so$$\frac{\partial L_t}{\partial h_t}=W_y^\top(\hat y_t-y_y)$$
Next, for the indirect path term, we pass via the hidden layer $h_{t+1}$. Using the chain rule, we get:$$\frac{\partial L}{\partial h_{t+1}}\frac{\partial h_{t+1}}{\partial h_t}=\frac{\partial L}{\partial h_{t+1}}\frac{\partial h_{t+1}}{\partial a_{t+1}}\frac{\partial a_{t+1}}{\partial h_t}$$Then, $\frac{\partial h_{t+1}}{\partial a_{t+1}}=1-h_{t+1}^2$ and $\frac{\partial a_{t+1}}{\partial h_t}=W_h$. When these get combined element-wise, we get $$\frac{\partial L}{\partial h_{t+1}}\frac{\partial h_{t+1}}{\partial h_t} = W_h^\top\left(\frac{\partial L}{\partial h_{t+1}}\odot(1-h^2_{t+1})\right)$$
Finally, combining everything together, we get:$$\frac{\partial L}{\partial h_{t}}=W_y^\top(\hat y_t-y_y) + W_h^\top\left(\frac{\partial L}{\partial h_{t+1}}\odot(1-h^2_{t+1})\right)$$
# Convolution Neural Networks
### 1a.
With an input $I\in \mathbb R^{n\times n\times d_0}$ given $d_0$ input channels, a kernel size $k\times k$, stride $s$, and padding $p$, the size of the output is: $$m=\left\lfloor\frac{n-k+2p}{s}\right\rfloor+1$$Then the output is $$O\in\mathbb R^{m\times m\times d_1}$$given $d_1$ output channels.
### 1b.
Here we multiply the kernel matrix $K$ with each "window" of the image matrix $I$ component-wise. The output of each of these matrix multiplications forms the output matrix:$$\begin{bmatrix}5(1)+1(0)+3(0)+0(-1) & 1(1)+1(0)+0(0)+2(-1) \\ 3(1)+0(0)+4(0)+4(-1) & 0(1)+2(0)+4(0)+0(-1)\end{bmatrix}=\begin{bmatrix}5 & -1 \\ -1 & 0\end{bmatrix}$$
