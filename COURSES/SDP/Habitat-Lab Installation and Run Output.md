### Clone the repos
```bash
mkdir legged_nav
cd legged_nav 
git clone --branch kin2dyn git@github.com:joannetruong/habitat-lab.git
git clone https://github.com/facebookresearch/habitat-sim.git
cd habitat-sim && git checkout 1fb3f693e40279db09d0e0c9e5fa1357c30ab03c
```
![[Pasted image 20251118111143.png]]

### Create the conda environment
```bash
conda create -n legged_nav -y python=3.7 cmake=3.14.0 
conda activate legged_nav
```
![[Pasted image 20251118111343.png]]
I'm using a different environment name as to not interfere with my other cpu installation.
### Installing Habitat-Sim
```bash
pip install -r requirements.txt
python setup.py install --bullet --headless
```
Here I am not using the `--headless` flag.

`pip install -r requirements.txt`:
![[Pasted image 20251118111519.png]]

`python setup.py install --bullet`
![[Pasted image 20251118112150.png]]
This command seems to have finished without a problem.

### Installing Habitat-Lab
```bash
cd ../habitat-lab
pip install typing-extensions~=3.7.4 google-auth==1.6.3 simplejson braceexpand pybullet cython pkgconfig squaternion
conda install -y pytorch torchvision torchaudio cudatoolkit=11.3 -c pytorch
pip install -r requirements.txt
python setup.py develop --all
```

![[Pasted image 20251118112521.png]]
`typing_extensions` errors during installation.

Using `pip install torch==1.13.1+cu117 torchvision==0.14.1+cu117 torchaudio==0.13.1 --extra-index-url https://download.pytorch.org/whl/cu117` instead of the given conda command:
![[Pasted image 20251118113051.png]]
![[Pasted image 20251118113213.png]]

Using `python setup.py install --all` instead of develop:
![[Pasted image 20251118113322.png]]

### Adjusting YAML files.
In **pointnav_quadruped**:
- POSITION / ORIENTATION changes as described.
- ROBOT_URF -> `/shared/habitat_datasets/URDF_demo_assets/spot/urdf/spot.urdf`
- DATA_PATH -> `/shared/habitat_datasets/datasets/pointnav_hm3d_gibson/pointnav_spot_0.3/{split}/{split}.json.gz`

In **ddppo_pointnav_quadruped**:
```yml
TENSORBOARD_DIR: './output/tb'
VIDEO_DIR: './output/video_dir'
EVAL_CKPT_PATH_DIR: './output/checkpoints'
CHECKPOINT_FOLDER: './output/checkpoints'
TXT_DIR: './output/txts'
```

### Training
I use the following command:
```bash
python -u -m habitat_baselines.run --exp-config habitat_baselines/config/pointnav/ddppo_pointnav_quadruped.yaml --run-type train
```
#### Errors
![[Pasted image 20251118114248.png]]
Tensorboard issue, fixed using `pip install tensorboard`.
![[Pasted image 20251118114338.png]]
- - -
![[Pasted image 20251118114425.png]]
`ifcfg` package is not found. Fixed using `pip install ifcfg`. This does throw errors when installing though.![[Pasted image 20251118114537.png]]
- - -
Finally we have all the packages installed, however it still does not run because it can't seem to see the dataset.
![[Pasted image 20251118115026.png]]


